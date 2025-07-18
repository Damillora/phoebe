package services

import (
	"errors"
	"fmt"
	"strings"

	"github.com/Damillora/phoebe/pkg/database"
	"github.com/Damillora/phoebe/pkg/models"
	"github.com/google/uuid"
)

func GetTagAll() []models.TagListItem {
	var tags []models.TagListItem
	database.DB.Model(&database.Tag{}).
		Joins("join tag_types on tag_types.id = tags.tag_type_id").
		Joins("left join post_tags on post_tags.tag_id = tags.id").
		Select("tags.id as tag_id, tags.name as tag_name, tag_types.name as tag_type, count(post_tags.post_id) as post_count").
		Group("tags.id, tags.name, tag_types.name").
		Order("post_count DESC").
		Find(&tags)
	return tags
}

func GetTags(q string, tagType string, page int, perPage int) []models.TagListItem {
	var tags []models.TagListItem
	query := database.DB.Model(&database.Tag{}).
		Joins("join tag_types on tag_types.id = tags.tag_type_id").
		Joins("left join post_tags on post_tags.tag_id = tags.id").
		Select("tags.id as tag_id, tags.name as tag_name, tag_types.name as tag_type, count(post_tags.post_id) as post_count")

	if q != "" {
		query = query.Where("tags.name LIKE ?", "%"+q+"%")
	}
	if tagType != "" {
		query = query.Where("tag_types.name = ?", tagType)
	}
	query = query.Group("tags.id, tags.name, tag_types.name").
		Order("post_count DESC").
		Offset((page - 1) * perPage).
		Limit(perPage)

	query.
		Find(&tags)
	return tags
}

func CountTags(q string, tagType string) int {
	query := database.DB.Model(&database.Tag{}).
		Joins("join tag_types on tag_types.id = tags.tag_type_id")

	if q != "" {
		query = query.Where("tags.name LIKE ?", "%"+q+"%")
	}
	if tagType != "" {
		query = query.Where("tag_types.name = ?", tagType)
	}
	query = query.Group("tags.id, tags.name, tag_types.name")

	var count int64
	query.Count(&count)
	return int(count)
}

func GetTagFilterString(tagString []string) []models.TagListItem {
	tagObjs, _ := ParseReadTags(tagString)
	return GetTagFilter(tagObjs)
}

func GetTagFilter(tagObjs []database.Tag) []models.TagListItem {
	var tagIds []string
	for _, val := range tagObjs {
		tagIds = append(tagIds, val.ID)
	}

	var tags []models.TagListItem
	database.DB.Model(&tagObjs).
		Joins("join tag_types on tag_types.id = tags.tag_type_id").
		Joins("left join post_tags on post_tags.tag_id = tags.id").
		Select("tags.id as tag_id, tags.name as tag_name, tag_types.name as tag_type, count(post_tags.post_id) as post_count").
		Group("tags.id, tags.name, tag_types.name").
		Order("post_count DESC").
		Find(&tags, tagIds)
	return tags
}

func GetTag(tagString string) (*models.TagReadModel, error) {
	tagObj, err := FindTag(tagString)
	if err != nil {
		return nil, err
	}
	var tagModel models.TagReadModel

	database.DB.Model(&tagObj).
		Joins("join tag_types on tag_types.id = tags.tag_type_id").
		Joins("left join post_tags on post_tags.tag_id = tags.id").
		Select("tags.id as tag_id, tags.name as tag_name, tag_types.name as tag_type, tags.note as tag_note, count(post_tags.post_id) as post_count").
		Group("tags.id, tags.name, tag_types.name, tags.note").
		First(&tagModel, "tags.id = ? ", tagObj.ID)

	return &tagModel, nil
}

func GetTagAutocomplete(searchValue string, forcePositive bool) []string {
	if forcePositive {
		return getPositiveTagAutocomplete(strings.TrimPrefix(searchValue, "-"))
	}
	if strings.HasPrefix(searchValue, "-") {
		return getNegativeTagAutocomplete(strings.TrimPrefix(searchValue, "-"))
	} else {
		return getPositiveTagAutocomplete(searchValue)
	}
}

func getPositiveTagAutocomplete(searchValue string) []string {
	var tags []string
	query := database.DB.Model(&database.Tag{}).
		Joins("join tag_types on tag_types.id = tags.tag_type_id").
		Select("concat(tag_types.name,':',tags.name) as name")

	tagFields := strings.Split(searchValue, ":")
	if len(tagFields) == 2 {
		query = query.
			Where("tags.name LIKE ?", "%"+tagFields[1]+"%").
			Where("tag_types.name = ?", tagFields[0])
	} else if len(tagFields) == 1 {
		query = query.
			Where("tags.name LIKE ?", "%"+tagFields[0]+"%")
	}

	result := query.Find(&tags)
	if result.Error != nil {
		return []string{}
	}
	return tags
}
func getNegativeTagAutocomplete(searchValue string) []string {
	var tags []string
	query := database.DB.Model(&database.Tag{}).
		Joins("join tag_types on tag_types.id = tags.tag_type_id").
		Select("concat('-',tag_types.name,':',tags.name) as name")

	tagFields := strings.Split(searchValue, ":")
	if len(tagFields) == 2 {
		query = query.
			Where("tags.name LIKE ?", "%"+tagFields[1]+"%").
			Where("tag_types.name = ?", tagFields[0])
	} else if len(tagFields) == 1 {
		query = query.
			Where("tags.name LIKE ?", "%"+tagFields[0]+"%")
	}

	result := query.Find(&tags)
	if result.Error != nil {
		return []string{}
	}
	return tags
}

func FindTagGeneric(tagName string) (*database.Tag, error) {
	var tag database.Tag
	result := database.DB.Where("name = ?", tagName).First(&tag)
	if result.Error != nil {
		return nil, result.Error
	}
	return &tag, nil
}
func FindTagComplex(tagName string, tagTypeString string) (*database.Tag, error) {
	var tag database.Tag
	var tagType database.TagType
	result := database.DB.Where("name = ?", tagTypeString).First(&tagType)
	if result.Error != nil {
		return nil, result.Error
	}

	result = database.DB.Where("name = ? AND tag_type_id = ? ", tagName, tagType.ID).First(&tag)

	if result.Error != nil {
		return nil, result.Error
	}
	return &tag, nil
}

func CreateOrUpdateTagGeneric(tagName string) (*database.Tag, error) {
	tag, err := FindTagGeneric(tagName)
	if err != nil {
		var tagType database.TagType
		database.DB.Where("name = ?", "general").First(&tagType)

		tag = &database.Tag{
			ID:        uuid.NewString(),
			Name:      tagName,
			TagTypeID: tagType.ID,
		}
		result := database.DB.Create(&tag)
		if result.Error != nil {
			return nil, result.Error
		}

	}
	return tag, nil
}
func CreateOrUpdateTagComplex(tagName string, tagTypeString string) (*database.Tag, error) {
	tag, err := FindTagComplex(tagName, tagTypeString)

	if err != nil {
		var tagType database.TagType
		result := database.DB.Where("name = ?", tagTypeString).First(&tagType)
		if result.Error != nil {
			return nil, result.Error
		}
		tag = &database.Tag{
			ID:        uuid.NewString(),
			Name:      tagName,
			TagTypeID: tagType.ID,
		}
		result = database.DB.Create(&tag)
		if result.Error != nil {
			return nil, result.Error
		}

	}
	return tag, nil
}
func CreateOrUpdateTag(tagSyntax string) (*database.Tag, error) {
	tagFields := strings.Split(tagSyntax, ":")
	var tagName string
	var tagType string
	if len(tagFields) == 1 {
		tagName = tagFields[0]
		return CreateOrUpdateTagGeneric(tagName)
	} else if len(tagFields) == 2 {
		tagType = tagFields[0]
		tagName = tagFields[1]
		return CreateOrUpdateTagComplex(tagName, tagType)
	} else {
		return nil, errors.New("Malformed tag syntax")
	}
}

func FindTag(tagSyntax string) (*database.Tag, error) {
	tagFields := strings.Split(tagSyntax, ":")
	var tagName string
	var tagType string
	if len(tagFields) == 1 {
		tagName = tagFields[0]
		return FindTagGeneric(tagName)
	} else if len(tagFields) == 2 {
		tagType = tagFields[0]
		tagName = tagFields[1]
		return FindTagComplex(tagName, tagType)
	} else {
		return nil, errors.New("Malformed tag syntax")
	}
}

func ParseTags(tags []string) ([]database.Tag, error) {
	var result []database.Tag
	for _, tagSyntax := range tags {
		tag, err := CreateOrUpdateTag(tagSyntax)
		if err != nil {
			return nil, err
		}
		result = append(result, *tag)
	}
	return result, nil
}

func ParseReadTags(tags []string) ([]database.Tag, error) {
	var result []database.Tag
	for _, tagSyntax := range tags {
		tag, err := FindTag(tagSyntax)
		if err != nil {
			return nil, err
		}
		result = append(result, *tag)
	}
	return result, nil
}

func UpdateTagNotes(tagString string, notes string) error {
	tagObj, err := FindTag(tagString)
	if err != nil {
		return err
	}

	tagObj.Note = notes

	result := database.DB.Save(&tagObj)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func UpdateTag(tagString string, model models.TagUpdateModel) error {
	tagObj, err := FindTag(tagString)
	if err != nil {
		return err
	}

	tagObj.TagTypeID = model.TagTypeID
	tagObj.Name = model.Name

	result := database.DB.Save(&tagObj)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func GetRelatedTags(tagSyntax string) ([]models.TagListItem, error) {
	tags, err := FindTag(tagSyntax)

	if err != nil {
		return nil, err
	}
	var postIds []string
	database.DB.
		Model(&tags).
		Joins("join post_tags on post_tags.tag_id = tags.id").
		Select("post_tags.post_id").
		Where("post_tags.tag_id = ?", tags.ID).
		Find(&postIds)

	var tagIds []string
	database.DB.
		Model(&tags).
		Joins("join post_tags on post_tags.tag_id = tags.id").
		Select("post_tags.tag_id").
		Where("post_tags.post_id IN ?", postIds).
		Find(&tagIds)
	fmt.Printf("%+v", tags)
	fmt.Println()
	fmt.Printf("%v", tagIds)
	fmt.Println()

	var tagInfo []models.TagListItem
	database.DB.Model(&tags).
		Joins("join tag_types on tag_types.id = tags.tag_type_id").
		Joins("left join post_tags on post_tags.tag_id = tags.id").
		Select("tags.id as tag_id, tags.name as tag_name, tag_types.name as tag_type, count(post_tags.post_id) as post_count").
		Group("tags.id, tags.name, tag_types.name").
		Order("post_count DESC").
		Find(&tagInfo, tagIds)

	return tagInfo, nil
}
