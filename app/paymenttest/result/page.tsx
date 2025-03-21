import sendEmail, { UpdatedPublicationRequestPaymentStatus } from "../action";
import PaymentSucessfullNotification from "./components/paymentSucessfullNotification";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<Record<string, any>>;
}) {
  const {
    trade_status,
    link,
    type = "Download",
    author,
    publicationRequestId,
  } = await searchParams;

  console.log("========= in payment result page =========");
  console.log({
    trade_status,
    link,

    author,
    publicationRequestId,
  });
  console.log(type[1]);

  if (type[1] == "1") {
    if (trade_status == "PAY_SUCCESS") {
      await sendEmail({ link });
      return (
        <div className="flex items-center justify-center pt-10">
          <PaymentSucessfullNotification link={link} type={"Download"} />
        </div>
      );
    }
  }
  if (trade_status == "PAY_SUCCESS") {
    if (author && publicationRequestId) {
      console.log("=========== in payment innner section ===========");
      const payload = {
        paymentStatus: "Confirmed",
        author: author[0],
        publciationRequest: publicationRequestId[1],
      };

      console.log(payload);
      const res = await UpdatedPublicationRequestPaymentStatus({
        payload: payload,
        publicationRequestId: publicationRequestId[1],
      });
      console.log(res);
    }

    return (
      <div className="flex items-center justify-center pt-10">
        <PaymentSucessfullNotification link={link} type={type} />
      </div>
    );
  } else return <>failed</>;
}
