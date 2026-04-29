# Variables
BUNDLE = bundle
JEKYLL = $(BUNDLE) exec jekyll

# 1. DEFAULT TARGET
# Just typing 'make' will start your local server
all: dev

# 2. DEV TARGET (Local Host)
# This starts the Jekyll server on http://localhost:4000
dev:
	@echo "Starting Jekyll local host on http://localhost:4000..."
	$(BUNDLE) install
	$(JEKYLL) serve --livereload --incremental

# 3. BUILD TARGET
# Generates the static site into the _site folder
build:
	@echo "Building static site..."
	$(BUNDLE) install
	$(JEKYLL) build

# 4. CLEAN TARGET
# Removes the generated site and cache
clean:
	@echo "Cleaning up..."
	rm -rf _site .jekyll-cache .bundle

.PHONY: all dev build clean