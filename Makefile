.PHONY: install
install:
	npm install


.PHONY: run-sqs
run-sqs:
	docker run --name local-sqs --rm -p 4566:4566 -p 4571:4571 -e "SERVICES=sqs" localstack/localstack


.PHONY: provision-queue
provision-queue:
	node ./create.js


.PHONY: send
send:
	node ./send.js


.PHONY: receive
receive:
	node ./receive.js
