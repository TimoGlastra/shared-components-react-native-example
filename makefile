.PHONY: all
all: update clean setup-libraries build-libraries app

.PHONY: update
update:
	git submodule update --remote

.PHONY: clean
clean:
	yarn cache clean

	rm -rf anoncreds-rs/wrappers/javascript/node_modules
	rm -rf aries-askar/wrappers/javascript/node_modules
	rm -rf indy-vdr/wrappers/javascript/node_modules
	rm -rf aries-framework-javascript/node_modules
	rm -rf app/node_modules

.PHONY: setup-libraries
setup-libraries:
	rm -f anoncreds-rs/wrappers/javascript/anoncreds-react-native/anoncreds.node
	yarn --cwd=anoncreds-rs/wrappers/javascript install

	rm -f aries-askar/wrappers/javascript/aries-askar-react-native/aries_askar.node
	yarn --cwd=aries-askar/wrappers/javascript install

	rm -f indy-vdr/wrappers/javascript/indy-vdr-react-native/indy_vdr.node
	yarn --cwd=indy-vdr/wrappers/javascript install

	yarn --cwd=aries-framework-javascript install

.PHONY: build-libraries
build-libraries:
	yarn --cwd=anoncreds-rs/wrappers/javascript build
	yarn --cwd=aries-askar/wrappers/javascript build
	yarn --cwd=indy-vdr/wrappers/javascript build
	yarn --cwd=aries-framework-javascript build

.PHONY: app
app:
	yarn --cwd=app install

.PHONY: ios
ios: 
	(cd app && pod install --project-directory=ios)
	yarn --cwd=app ios

.PHONY: android
android:
	yarn --cwd=app android
