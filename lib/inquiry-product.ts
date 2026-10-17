type ProductDetails = {
  id: string; name: string; description: string; strength: string;
  size: string | null; wrapper: string | null;
};

export function snapshotInquiryProduct(product: ProductDetails) {
  return {
    productOriginalId: product.id,
    productName: product.name,
    productDescription: product.description,
    productStrength: product.strength,
    productSize: product.size,
    productWrapper: product.wrapper,
  };
}

type InquiryDetails = {
  productName: string | null; productDescription: string | null;
  productStrength: string | null; productSize: string | null;
  productWrapper: string | null;
  product: ProductDetails | null;
};

export function getInquiryProduct(inquiry: InquiryDetails) {
  if (inquiry.productName !== null) {
    return {
      name: inquiry.productName,
      description: inquiry.productDescription ?? "",
      strength: inquiry.productStrength,
      size: inquiry.productSize,
      wrapper: inquiry.productWrapper,
    };
  }
  return inquiry.product ?? {
    name: "Deleted product", description: "", strength: null, size: null, wrapper: null,
  };
}
