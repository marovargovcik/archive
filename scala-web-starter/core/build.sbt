import smithy4s.codegen.Smithy4sCodegenPlugin

name := "core"

libraryDependencies += "org.scalameta" %% "munit" % "0.7.29" % Test
libraryDependencies += "org.typelevel" %% "cats-core" % "2.10.0"
libraryDependencies += "org.typelevel" %% "cats-effect" % "3.5.2"
libraryDependencies += "co.fs2" %% "fs2-core" % "3.9.2"
libraryDependencies += "com.disneystreaming.smithy4s" %% "smithy4s-http4s" % smithy4sVersion.value
libraryDependencies += "com.disneystreaming.smithy4s" %% "smithy4s-http4s-swagger" % smithy4sVersion.value
libraryDependencies += "org.http4s" %% "http4s-ember-server" % "0.23.23"
libraryDependencies += "is.cir" %% "ciris" % "3.3.0"
libraryDependencies += "com.lihaoyi" %% "upickle" % "3.1.3"
libraryDependencies += "com.softwaremill.sttp.client3" %% "core" % "3.9.0"
