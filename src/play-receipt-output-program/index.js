import INVOICE from "./invoices.json";
import PLAYS from "./plays.json";

function statement(invoice, plays) {
  let totalAmount = 0;
  let result = `청구 내역(고객명: ${invoice.customer})\n`;

  const usd = (aNumber) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber);
  };

  const playFor = (aPerformance) => {
    return plays[aPerformance.playID]; // object {name, type}
  };

  const amountFor = (aPerformance) => {
    let result = 0;
    switch (playFor(aPerformance).type) {
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
        throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
    }

    return result;
  };

  const volumeCreaditsFor = (aPerformance) => {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type)
      result += Math.floor(aPerformance.audience / 5);

    return result;
  };

  for (let perf of invoice.performances) {
    // 청구 내역을 출력한다.
    result += `${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += amountFor(perf);
  }

  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    volumeCredits += volumeCreaditsFor(perf);
  }

  result += `총액: ${usd(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}

const Receipt = () => {
  const result = statement(INVOICE[0], PLAYS);
  console.log("result", result);

  return <div className="App"></div>;
};

export default Receipt;
