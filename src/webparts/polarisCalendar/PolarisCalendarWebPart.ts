import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './PolarisCalendarWebPart.module.scss';
import * as strings from 'PolarisCalendarWebPartStrings';

import * as $ from 'jquery';
import '@progress/kendo-ui';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as pnp from '@pnp/sp/presets/all';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { SPA } from './apps/spa';


export interface IPolarisCalendarWebPartProps {
  link: string;
}

export default class PolarisCalendarWebPart extends BaseClientSideWebPart<IPolarisCalendarWebPartProps> {
  // Moving the accessor as a workaround to clear TypeScript 4.1.2 compiler error, commenting the original accessor below
  constructor() {
    super();
    Object.defineProperty(this, 'dataVersion', {
      get() {
        return Version.parse('1.0');
      }
    });
  }

  public render(): void {
    /*
        Load external CDN files (JS/CSS)
    */
    SPComponentLoader.loadCss('https://kendo.cdn.telerik.com/2021.1.119/styles/kendo.common-material.min.css');
    SPComponentLoader.loadCss('https://kendo.cdn.telerik.com/2021.1.119/styles/kendo.material.min.css');

    SPComponentLoader.loadScript('https://kendo.cdn.telerik.com/2021.1.119/js/jszip.min.js');
    //SPComponentLoader.loadScript('https://kendo.cdn.telerik.com/2021.1.119/js/kendo.all.min.js');

    if (this.properties.link == null) 
      this.domElement.innerHTML = `<h3>Edit Web Part Property Pane</h3><p>Go to the web part property page and add the ServiceNOW REST Query URL</p>`;
    else 
      this.domElement.innerHTML = `<div><table id="filter" style="min-width: 100%; padding-bottom: 15px;"></table></div><div id="calendar"></div>`;

    const spa = SPA.getInstance(this.properties.link);
  }

  //protected get dataVersion(): Version {
  //  return Version.parse('1.0');
  //}

  protected onInit(): Promise < void > {
    return super.onInit().then(_ => {
      pnp.sp.setup({
        spfxContext: this.context,
        sp: {
          headers: {
            Accept: 'application/json;odata=nometadata'
          }
        }
      });
    });
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupName: 'All Fields are Required',
              groupFields: [
                PropertyPaneTextField('link', {
                  label: 'ServiceNOW REST URL'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
