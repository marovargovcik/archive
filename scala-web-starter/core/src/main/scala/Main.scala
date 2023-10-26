package core

import smithy4s.catFacts._
import cats.effect._
import cats.implicits._
import org.http4s.implicits._
import org.http4s.ember.server._
import org.http4s._
import com.comcast.ip4s._
import smithy4s.http4s.SimpleRestJsonBuilder

object CatFactsServiceImpl extends CatFactsService[IO] {
  def operation(count: Int, locale: Option[String]): IO[Output] = IO.pure {
    Output(CatFactsRequest.getCatFacts(Input(count, locale)))
  }
}

object Routes {
  private val catFactsService: Resource[IO, HttpRoutes[IO]] =
    SimpleRestJsonBuilder.routes(CatFactsServiceImpl).resource

  private val docs: HttpRoutes[IO] =
    smithy4s.http4s.swagger.docs[IO](CatFactsService)

  val all: Resource[IO, HttpRoutes[IO]] = catFactsService.map(_ <+> docs)
}

object Main extends IOApp.Simple {
  val run =
    Configuration
      .load[IO]()
      .flatMap { config =>
        Routes.all
          .flatMap { routes =>
            EmberServerBuilder
              .default[IO]
              .withPort(config.port)
              .withHttpApp(routes.orNotFound)
              .build
          }
          .use(_ => IO.never)
      }
}
