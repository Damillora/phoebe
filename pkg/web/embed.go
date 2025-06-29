package web

import (
	"embed"
	"io/fs"
)

//go:embed all:build/*
var webFS embed.FS

func WebAssets() fs.FS {
	build, _ := fs.Sub(webFS, "build")
	return build
}
