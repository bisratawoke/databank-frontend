import PaymentSucessfullNotification from "./components/paymentSucessfullNotification";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<Record<string, any>>;
}) {
  const { tradeSucess } = await searchParams;

  if (tradeSucess == "PAYMENT_SUCESS")
    return (
      <div className="flex items-center justify-center pt-10">
        <PaymentSucessfullNotification />
      </div>
    );
  else return <>failed</>;
}
