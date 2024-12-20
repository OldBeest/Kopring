plugins {
	kotlin("jvm") version "1.9.25"
	kotlin("plugin.spring") version "1.9.25"
	war
	id("org.springframework.boot") version "3.3.4"
	id("io.spring.dependency-management") version "1.1.6"
	kotlin("plugin.jpa") version "1.9.25"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.springframework.boot:spring-boot-starter-security")
	testImplementation("org.springframework.security:spring-security-test")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	providedRuntime("org.springframework.boot:spring-boot-starter-tomcat")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	runtimeOnly("com.mysql:mysql-connector-j")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	implementation("com.googlecode.json-simple:json-simple:1.1.1")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")

	//JWT
	implementation("io.jsonwebtoken:jjwt-api:0.11.5")
	implementation("io.jsonwebtoken:jjwt-impl:0.11.5")
	implementation("io.jsonwebtoken:jjwt-jackson:0.11.5")

	//Swagger
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0")

	//
	implementation("com.squareup.okhttp3:okhttp:4.12.0")
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict")
	}
}

allOpen{
	annotation("javax.persistence.Entity")
	annotation("javax.persistence.MappedSuperclass")
	annotation("javax.persistence.Embeddable")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
