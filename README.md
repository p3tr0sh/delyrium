# Delyrium

Delyrium generates a Gatsby based web application for lyr-formatted Markdown music sheets.
It can be imported as a git submodule into a sheets repository.

Add a Makefile to the sheets repository to execute delyrium from the top level:

```Makefile
.PHONY: clean transform build develop install

CD=cd delyrium

install:
	$(CD) && npm install

develop: install
	$(CD) && npm run develop

build: install
	$(CD) && npm run build


transform:
	$(CD) && npm run transform ../

clean:
	rm -r delyrium/src/sheets
```

`make transform` transforms they lyr-formatted Markdown files to a Gatsby-parseable format, basically replacing the header.
For testing locally use `make develop`.
