package core

import smithy4s.catFacts._
import upickle.default.{read, ReadWriter => RW, macroRW}
import cats.syntax.all._
import sttp.client3.{SimpleHttpClient, UriContext, basicRequest}

object CatFactsRequest {
  def getCatFacts(input: Input) = {
    val client = SimpleHttpClient()

    val url = uri"https://meowfacts.herokuapp.com/"
      .addParam("count", input.count.toString)
      .addParam("lang", input.locale)

    val response = client.send(basicRequest.get(url))

    response.body match {
      case Right(json) => read[Response](json).data
      case Left(error) => List.empty
    }
  }

  final case class Response(data: List[String])

  object Response {
    implicit val rw: RW[Response] = macroRW
  }
}
