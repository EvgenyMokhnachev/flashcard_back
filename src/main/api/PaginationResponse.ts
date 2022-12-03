class HttpErrorResponse<I> {
  items: I[];
  total?: number;

  constructor(items?: I[], total?: number) {
    this.items = items || [];
    this.total = total;
  }
}

export default HttpErrorResponse;
