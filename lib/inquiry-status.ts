/** Normalize URL status filters; repeated parameters use the first value. */
export function getInquiryStatusFilter(value: unknown) {
  const status = Array.isArray(value) ? value[0] : value;

  switch (status) {
    case "NEW":
    case "CONTACTED":
    case "INTERESTED":
    case "NOT_INTERESTED":
    case "COMPLETED":
      return status;
    default:
      return undefined;
  }
}
