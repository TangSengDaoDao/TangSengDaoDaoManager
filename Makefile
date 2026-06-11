IMAGE := tangsengdaodaomanager
REMOTE_IMAGE := registry.cn-shanghai.aliyuncs.com/wukongim/tangsengdaodaomanager:latest
PLATFORM ?= linux/arm64
PLATFORMS ?= linux/amd64,linux/arm64

build:
	docker build --platform $(PLATFORM) -t $(IMAGE) .

deploy:
	docker build --platform $(PLATFORM) -t $(IMAGE) .
	docker tag $(IMAGE) $(REMOTE_IMAGE)
	docker push $(REMOTE_IMAGE)

deploy-multi:
	docker buildx build --platform $(PLATFORMS) -t $(REMOTE_IMAGE) --push .
