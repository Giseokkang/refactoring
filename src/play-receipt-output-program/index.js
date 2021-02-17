/* eslint-disable no-use-before-define */
import INVOICE from "./invoices.json";
import PLAYS from "./plays.json";

const statement = (invoice, plays) => {
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
  console.log("statementData", statementData);
  return renderPlainText(statementData);
};

const renderPlainText = (data) => {
  const usd = (aNumber) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber);
  };

  const totalAmount = () => {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.play.amount;
    }
    return result;
  };

  const totalVolumneCredits = () => {
    let volumeCredits = 0;
    for (let perf of data.performances) {
      volumeCredits += perf.volumeCredits;
    }

    return volumeCredits;
  };

  let result = `청구 내역(고객명: ${data.customer})\n`;
  for (let perf of data.performances) {
    // 청구 내역을 출력한다.
    result += `${perf.play.name}: ${usd(perf.amount / 100)} (${
      perf.audience
    }석)\n`;
  }

  result += `총액: ${usd(totalAmount() / 100)}\n`;
  result += `적립 포인트: ${totalVolumneCredits()}점\n`;
  return result;
};

const Receipt = () => {
  const result = statement(INVOICE[0], PLAYS);
  console.log("result", result);

  return <div className="App"></div>;
};

export default Receipt;
