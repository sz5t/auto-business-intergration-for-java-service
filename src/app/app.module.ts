
import { BsnTableRelativeMessageService } from './core/relative-Service/relative-service';
import { NgModule, LOCALE_ID, APP_INITIALIZER, Injector } from '@angular/core';
import { HttpClient, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DelonModule } from './delon.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { RoutesModule } from './routes/routes.module';
import { LayoutModule } from './layout/layout.module';
import { StartupService } from '@core/startup/startup.service';
import { DefaultInterceptor } from '@core/net/default.interceptor';
import { SimpleInterceptor } from '@delon/auth';
// angular i18n
import { registerLocaleData, CommonModule } from '@angular/common';
import localeZhHans from '@angular/common/locales/zh-Hans';
registerLocaleData(localeZhHans);
// i18n
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { I18NService } from '@core/i18n/i18n.service';
// third
import { UEditorModule } from 'ngx-ueditor';
import { NgxTinymceModule } from 'ngx-tinymce';
import { ApiService } from '@core/utility/api-service';
import { RelativeService, RelativeResolver, BsnToolbarRelativeMessage } from '@core/relative-Service/relative-service';
import { BsnComponentMessage, BSN_COMPONENT_CASCADE, BSN_COMPONENT_MODES } from './core/relative-Service/BsnTableStatus';
import { Subject } from 'rxjs/Subject';
// JSON-Schema form
// import { JsonSchemaModule } from '@shared/json-schema/json-schema.module';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, `assets/i18n/`, '.json');
}

export function StartupServiceFactory(startupService: StartupService): Function {
    return () => startupService.load();
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        DelonModule.forRoot(),
        CoreModule,
        SharedModule,
        LayoutModule,
        RoutesModule,
        // i18n
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        // thirds
        UEditorModule.forRoot({
            // **注：** 建议使用本地路径；以下为了减少 ng-alain 脚手架的包体大小引用了CDN，可能会有部分功能受影响
            // 指定ueditor.js路径目录
            path: '//apps.bdimg.com/libs/ueditor/1.4.3.1/',
            // 默认全局配置项
            options: {
                themePath: '//apps.bdimg.com/libs/ueditor/1.4.3.1/themes/'
            }
        }),
        NgxTinymceModule.forRoot({
            baseURL: '//cdn.bootcss.com/tinymce/4.7.4/'
        }),
        // // JSON-Schema form
        // JsonSchemaModule
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'zh-Hans' },
        // { provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true}, //影响自定义的服务请求
        { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true},
        { provide: ALAIN_I18N_TOKEN, useClass: I18NService, multi: false },
        StartupService,
        {
            provide: APP_INITIALIZER,
            useFactory: StartupServiceFactory,
            deps: [StartupService],
            multi: true
        },
        {
            provide: BSN_COMPONENT_MODES, 
            useValue: new Subject<BsnComponentMessage>()
        },
        {
            provide: BSN_COMPONENT_CASCADE, 
            useValue: new Subject<BsnComponentMessage>()
        },
        ApiService,
        RelativeService,
        RelativeResolver
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
