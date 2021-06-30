import * as $ from 'jquery';
import '@progress/kendo-ui';
import { sp } from '@pnp/sp/presets/all';
import { ds } from './datasources';

export class ModelState extends kendo.data.ObservableObject {
    constructor() {
        super();
    }
}

export class SPA {
    protected static schedulerOptions: kendo.ui.SchedulerOptions;
    protected static scheduler: kendo.ui.Scheduler;
    private static instance: SPA;

    constructor() {}

    public static getInstance(link: string): SPA {
        this.schedulerOptions = null;
        this.schedulerOptions = null;
        const state = new ModelState();

        var dataArray = [];
        var currentDate = new Date();

        const getLocalDate = (isoString: string): Date => {
            let [year, month, date] = (isoString).split('T')[0].split('-').map(Number);
            let [hour, minute, second] = (isoString).split('T')[1].split(':').map(Number);

            return new Date (year, month-1, date, hour, minute);
        };

        const dsCalendar = ds({
            url: link,
            dsName: 'dsCalendar',
            schema: {
                model: {
                    id: 'id',
                    fields: {
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
                        ownerId: { type: 'string' }
                    }
                }
            }
        });

        $(() => {
            dsCalendar.read().done(_ => {
                // Create Resources DataSource based on property panel data
                let resources = [{field: 'ownerId', title: 'Customer'}];
                let teamArray = dsCalendar.data().map(item => item).map(item => item.ownerId).filter( (value, index, self) => self.indexOf(value) === index ).map(x => { return { ownerId: x }; });
                
                /*let strBuilder = null;
                teamArray.forEach((item, index) => {
                    switch (index % 2) {
                        case 0:
                            strBuilder += '<tr><td style="width: 50%; padding: 5px;"><input type="checkbox" id="team' + item.ownerId + '" class="k-checkbox" checked="checked"><label class="k-checkbox-label" style="padding: 5px; font-weight: bold; font-weight: bold;" for="team' + item.ownerId + '">' + item.ownerId + '</label></td>';
                            break;
                        case 1:
                            strBuilder += '<td style="width: 50%; padding: 5px;"><input type="checkbox" id="team' + item.ownerId + '" class="k-checkbox" checked="checked"><label class="k-checkbox-label" style="padding: 5px; font-weight: bold; font-weight: bold;" for="team' + item.ownerId + '">' + item.ownerId + '</label></td></tr>';
                            break;
                    }
                });
                if (strBuilder.endsWith('</td>')) strBuilder += '<td style="width: 50%; padding: 5px;"></td></tr>';
                $('#filter').append(strBuilder);*/

                /*$.each(calendars, (index, value) => {
                    teamArray.push({value: index, text: value['Title'], color: value['Color']});

                    switch (index % 2) {
                        case 0:
                            strBuilder += '<tr><td style="width: 50%; padding: 5px;"><input type="checkbox" id="team' + index + '" class="k-checkbox" checked="checked"><label class="k-checkbox-label" style="padding: 5px; font-weight: bold; color: #ffffff; font-weight: bold; background-color: ' + value['Color'] + '" for="team' + index + '">' + value['Title'] + '</label></td>';
                            break;
                        case 1:
                            strBuilder += '<td style="width: 50%; padding: 5px;"><input type="checkbox" id="team' + index + '" class="k-checkbox" checked="checked"><label class="k-checkbox-label" style="padding: 5px; font-weight: bold; color: #ffffff; font-weight: bold; background-color: ' + value['Color'] + '" for="team' + index + '">' + value['Title'] + '</label></td></tr>';
                            break;
                    }
                });
                if (strBuilder.endsWith('</td>')) strBuilder += '<td style="width: 50%; padding: 5px;"></td></tr>';
                $('#filter').append(strBuilder);*/

                resources[0]['dataSource'] = teamArray;

                $('#calendar').kendoScheduler({
                    date: new Date(),
                    startTime: new Date(kendo.toString(currentDate, 'yyyy/M/d') + ' 07:00 AM'),
                    endTime: new Date(kendo.toString(currentDate, 'yyyy/M/d') + ' 06:00 PM'),
                    editable: false,
                    views: [
                        { type: 'day' },
                        { type: 'workWeek', selected: true },
                        { type: 'month', eventHeight: 'auto', eventsPerDay: 5, eventSpacing: 10 },
                        { type: 'agenda'},
                    ],
                    toolbar: [ {name: 'search'} ],
                    dataSource: dsCalendar,
                    resources: resources
                });

                // Bind event trigger to checkboxes to enable calendar filtering
                $('#filter :checkbox').on('change', e => {
                    let checked = $.map( $('#filter :checked'), i => parseInt($(<HTMLElement>i)[0].id.slice(4)) );
                    let scheduler = $("#calendar").data("kendoScheduler");

                    scheduler.dataSource.filter({
                        operator: item => {
                            return $.inArray(item.teamId, checked) >= 0;
                        }
                    });
                });
            });

            const Events = {
            };

            const Utils = {
            };


        });

        return SPA.instance;
    }
}
