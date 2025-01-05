"use client";

import { useContextElement } from "@/context/Context";

export default function WishlistLength() {
  const { wishListlength } = useContextElement();

  return <>{wishListlength}</>;
}
