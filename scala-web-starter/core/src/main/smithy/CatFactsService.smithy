namespace smithy4s.catFacts

use alloy#simpleRestJson

@simpleRestJson
service CatFactsService {  
  version: "1.0.0",
  operations: [Operation]
}

@http(method: "POST", uri: "/cat-facts", code: 200)
operation Operation {
  input: Input,
  output: Output
}

structure Input {
  @required
  count: Integer,
  
  locale: String
}

list Facts {
  member: String
}

structure Output {
  @required
  facts: Facts
}