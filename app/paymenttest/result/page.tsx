import { UpdatedPublicationRequestPaymentStatus } from "../action";
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

  if (trade_status == "PAY_SUCCESS") {
    alert("success");
    if (author && publicationRequestId) {
      const payload = {
        paymentStatus: "Confirmed",
        author: author[0],
        publciationRequest: publicationRequestId[1],
      };

      const res = await UpdatedPublicationRequestPaymentStatus({
        payload: payload,
        publicationRequestId: publicationRequestId[1],
      });
    }

    return (
      <div className="flex items-center justify-center pt-10">
        <PaymentSucessfullNotification link={link} type={type} />
      </div>
    );
  } else return <>failed</>;
}
