# MyShoppingStore

---

UI:  http://myshoppingstorebucket.s3-website-us-east-1.amazonaws.com/

API: http://mystorebackend-env.eba-jydy275n.us-east-1.elasticbeanstalk.com

---


## Amazon Web Services

### AWS Simple Storage Service (S3)

---

## CircleCI

This full stack web application is deployed with a CircleCI continuous integration pipeline.


**Pipeline Highlights**:
1. Able to run the unit, integration and end-to-end tests for both backend and front-end applications
2. Able to do Pull Request builds against the *staging* and *main* branches
3. Able to deploy PR code to the Staging environment and main branch code to the Production environment

All the secrets found in the application are configured inside CircleCi and passed to the production application.

---

