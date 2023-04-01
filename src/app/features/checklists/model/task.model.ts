export class TaskModel {

  constructor(
    public id: string,
    public checked: boolean,
    public message: string,
    private _created: Date
  ) {
  }

  public get created(): Date {
    return this._created;
  }
}
