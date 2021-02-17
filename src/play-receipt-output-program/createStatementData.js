const createStatementData = (invoice, plays) => {
  const playFor = (aPerformance) => {
    return plays[aPerformance.playID]; // object {name, type}
  };

  const amountFor = (aPerformance) => {
    let result = 0;
    switch (aPerformance.play.type) {
      case "tragedy": //비극
        result = 40000;
        if (aPerformance.audience > 30)
          result += 1000 * (aPerformance.audience - 30);
        break;
      case "comedy": //희극
        result = 30000;
        if (aPerformance.audience > 20)
          result += 1000 + 500 * (aPerformance.audience - 20);
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`);
    }

    return result;
  };

  const volumeCreditsFor = (aPerformance) => {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === aPerformance.play.type)
      result += Math.floor(aPerformance.audience / 5);

    return result;
  };

  const totalAmount = (statementData) => {
    let result = 0;
    for (let perf of statementData.performances) {
      result += perf.amount;
    }
    return result;
  };

  const totalVolumneCredits = (statementData) => {
    let result = 0;
    for (let perf of statementData.performances) {
      console.log("perf", perf);
      result += perf.volumeCredits;
    }

    return result;
  };

  const enrichPerformance = (aPerformance) => {
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  };

  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumneCredits = totalVolumneCredits(statementData);

  return statementData;
};

export default createStatementData;
