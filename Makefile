
FILES=manifest.json background.js background.html README.md messageDisplay/* modules/* images/*

all: xpi

clean: ; -rm -f *.xpi

xpi: $(FILES)
	zip -r jira-tasks-load.xpi $(FILES)
