/**
 * HTML element wrapper
 */
export class Element {
  /**
   * Output string
   * @private
   */
  private readonly output: string;

  constructor(output: string) {
    this.output = output;
  }

  /**
   * Native stringify realization
   */
  public toString(): string {
    return this.output;
  }
}
