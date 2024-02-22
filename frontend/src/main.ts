import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerLicense } from '@syncfusion/ej2-base';
import { AppModule } from './app/app.module';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NAaF1cXmhLYVFxWmFZfVpgd19DZFZQQ2YuP1ZhSXxXdkdhWX9ddXBUQWhfVEM=');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
