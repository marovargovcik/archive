package core

import cats.effect.kernel.Async
import ciris._
import com.comcast.ip4s.{Port, port}

final case class Configuration(port: Port)

object Configuration {
  def load[F[_]](using Async[F])() =
    env("PORT")
      .as[Int]
      .option
      .map(_.flatMap(Port.fromInt(_)))
      .map(_.getOrElse(port"8080"))
      .map(Configuration.apply)
      .load[F]
}
