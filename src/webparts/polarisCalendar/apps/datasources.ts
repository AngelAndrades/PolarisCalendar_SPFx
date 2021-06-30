import * as $ from 'jquery';
import '@progress/kendo-ui';

interface DataSourceConfig {
    url: string;
    dsName: string;
    schema: kendo.data.DataSourceSchemaModel;
    pageSize?: number;
    filter?: kendo.data.DataSourceFilter;
    group?: kendo.data.DataSourceGroupItem;
    top?: number;
}

export const ds = (args: DataSourceConfig): kendo.data.SchedulerDataSource => {
    var dataArray = [];

    return new kendo.data.SchedulerDataSource({
        transport: {
            create: async options => {
                // Read Only data source
            },
            read: async options => {
                // https://swapi.dev/api/people/
                // https://northwind.now.sh/api/orders/
                await fetch(args.url, {
                    method: 'GET',
                    //mode: 'no-cors',
                    cache: 'no-cache',
                    credentials: 'omit',
                    /*headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }*/
                })
                .then(response => {
                    if (!response.ok) throw new Error(response.statusText);
                    return response.json();
                })
                .then(data => {
                    // process data into the required data schema
                    const temp = data.map( ({employeeId:id, shipName:title, orderDate:start, shippedDate:end, customerId:ownerId}) => ({id, title, start, end, ownerId}) )
                                    .map(item => { 
                                        item.start = new Date(Date.parse(item.start));
                                        item.end = new Date(Date.parse(item.end));
                                        return item; 
                                    });
                    options.success(temp);
                    /*
                        id: { type: 'number' },
                        title: { type: 'string' },
                        start: { type: 'date' },
                        end: { type: 'date' },
                        startTimezone: { type: 'string' },
                        endTimezone: { type: 'string' },
                        description: { type: 'string' },
                        location: { type: 'string' },
                        category: { type: 'string' },
                        fRecurrence: { type: 'boolean' },
                        recurrenceId: { type: 'number' },
                        recurrenceRule: { type: 'string' },
                        recurrenceException: { type: 'string' },
                        isAllDay: { type: 'boolean' },
                    */
                })
                .catch(error => {
                    console.error('error: ', error);
                });
                
            },
            update: async options => {
                // Read Only data source
            },
            destroy: async options => {
                // Read Only data source
            }
        },
        schema: { model: args.schema },
        pageSize: args.pageSize,
        filter: args.filter,
        group: args.group
    });
};