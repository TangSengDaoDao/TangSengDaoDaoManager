build:
	docker build -t tangsengdaodaomanager .
deploy:
	docker build -t tangsengdaodaomanager  .
	docker tag tangsengdaodaomanager registry.cn-shanghai.aliyuncs.com/wukongim/tangsengdaodaomanager:latest
	docker push registry.cn-shanghai.aliyuncs.com/wukongim/tangsengdaodaomanager:latest