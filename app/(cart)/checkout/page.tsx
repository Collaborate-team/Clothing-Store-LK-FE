import CartPage from "@/components/pages/CartPage";
export default function Checkout() {
  // We can pass a prop to start at checkout step if we modify CartPage,
  // but for now let's just use it as is.
  return <CartPage />;
}
