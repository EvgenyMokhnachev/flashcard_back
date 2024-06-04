class PaginationResponse<I> {
  items: I[];
  total?: number;

  constructor(items?: I[], total?: number) {
    this.items = items || [];
    this.total = total;
  }
}

export default PaginationResponse;
