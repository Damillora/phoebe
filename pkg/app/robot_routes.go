package app

import (
	"net/http"

	"github.com/Damillora/phoebe/pkg/config"
	"github.com/gin-gonic/gin"
)

func InitializeRobotRoutes(g *gin.Engine) {
	g.GET("/robots.txt", robots)
}

func robots(c *gin.Context) {
	if config.CurrentConfig.DisableSearchIndexing == "true" {
		c.String(http.StatusOK,
			`User-agent: *
Disallow: /`,
		)
		return
	} else {
		c.String(http.StatusOK, ``)
	}
}
