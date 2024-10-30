# Application Dependencies

## MyStore API Backend

- AWS RDS Postgres database instance
- AWS Elastic Beanstalk environment
- AWS Elastic Beanstalk CLI v3.20.2

```
{
  "name": "mystore-backend",
  "version": "0.1.0",
  "description": "MyStore Backend API",
  "main": "server.js",
  "engines": {
    "node": ">=14.18.1",
    "npm": ">=8.1.3"
  },
  "dependencies": {
    "bcrypt": "^5.0.1",
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "db-migrate": "^0.11.12",
    "db-migrate-pg": "^1.2.2",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "jsonwebtoken": "^8.5.1",
    "pg": "^8.5.1",
    "supertest": "^6.1.6",
    "tslog": "^3.2.2",
    "typescript": "^4.1.3"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.0",
    "@types/cors": "^2.8.12",
    "@types/express": "^4.17.9",
    "@types/jsonwebtoken": "^8.5.5",
    "@types/pg": "^7.14.7",
    "@types/node": "^15.12.4",
    "@typescript-eslint/parser": "^4.31.1",
    "@types/jasmine": "^3.9.1",
    "@types/supertest": "^2.0.11",
    "@typescript-eslint/eslint-plugin": "^4.31.1",
    "eslint": "^7.32.0",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-prettier": "^4.0.0",
    "jasmine": "^3.9.0",
    "jasmine-spec-reporter": "^7.0.0",
    "jasmine-ts": "^0.4.0",
    "prettier": "^2.4.0",
    "ts-node": "^9.1.1",
    "tsc-watch": "^4.2.9"
  }
}

```

## MyStore UI Front-end

- AWS CLI v2.3.1
- AWS Simple Storage Service bucket

```
{
  "name": "mystore-frontend",
  "version": "0.1.0",
  "description": "MyStore Front-end Web App",
  "dependencies": {
    "@angular/animations": "~12.2.0",
    "@angular/common": "~12.2.0",
    "@angular/compiler": "~12.2.0",
    "@angular/core": "~12.2.0",
    "@angular/forms": "~12.2.0",
    "@angular/localize": "~12.2.0",
    "@angular/platform-browser": "~12.2.0",
    "@angular/platform-browser-dynamic": "~12.2.0",
    "@angular/router": "~12.2.0",
    "@ng-bootstrap/ng-bootstrap": "^10.0.0",
    "bootstrap": "^4.5.0",
    "ngx-spinner": "^8.0.3",
    "ngx-webstorage-service": "^4.1.0",
    "rxjs": "~6.6.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.11.4"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~12.2.7",
    "@angular/cli": "~12.2.7",
    "@angular/compiler-cli": "~12.2.0",
    "@cypress/schematic": "^1.5.3",
    "@types/jasmine": "~3.8.0",
    "@types/node": "^12.11.1",
    "jasmine-core": "~3.8.0",
    "karma": "~6.3.0",
    "karma-chrome-launcher": "~3.1.0",
    "karma-coverage": "~2.0.3",
    "karma-jasmine": "~4.0.0",
    "karma-jasmine-html-reporter": "~1.7.0",
    "typescript": "~4.3.5",
    "cypress": "latest"
  }
}

```
