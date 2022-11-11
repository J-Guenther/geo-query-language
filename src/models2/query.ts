export class Query {

    selected: string | "*"

    select(fields: string | "*"): Query {
        this.selected = fields
        return this
    }

    where() {

    }


}
