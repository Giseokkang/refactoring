/* eslint-disable no-use-before-define */
import createStatementData from "./createStatementData";
import INVOICE from "./invoices.json";
import PLAYS from "./plays.json";

const statement = (data) => {
  const usd = (aNumber) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber);
  };

  let result = `청구 내역(고객명: ${data.customer})\n`;
  for (let perf of data.performances) {
    // 청구 내역을 출력한다.
    result += `${perf.play.name}: ${usd(perf.amount / 100)} (${
      perf.audience
    }석)\n`;
  }

  result += `총액: ${usd(data.totalAmount / 100)}\n`;
  result += `적립 포인트: ${data.totalVolumneCredits}점\n`;
  return result;
};

const Receipt = () => {
  const statementData = createStatementData(INVOICE[0], PLAYS);
  console.log("statementData", statementData);
  const result = statement(statementData);
  console.log("result", result);

  return <div className="App"></div>;
};

export default Receipt;
