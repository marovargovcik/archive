import smithy4s.codegen.Smithy4sCodegenPlugin

lazy val SCALA_VERSION = "3.3.1"

scalaVersion := SCALA_VERSION

/* Scalafix expects dependencies to be added on the ThisBuild scope even though [[cats]] and [[fs2]] are not meant to be used in every project */
ThisBuild / scalafixDependencies += "org.typelevel" %% "typelevel-scalafix-cats" % "0.1.5"
ThisBuild / scalafixDependencies += "org.typelevel" %% "typelevel-scalafix-cats-effect" % "0.1.5"
ThisBuild / scalafixDependencies += "org.typelevel" %% "typelevel-scalafix-fs2" % "0.1.5"

lazy val core = project
  .in(file("core"))
  .enablePlugins(Smithy4sCodegenPlugin)
  .settings(
    scalaVersion := SCALA_VERSION
  )
