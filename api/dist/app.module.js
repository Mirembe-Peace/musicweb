"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const payments_module_1 = require("./payments/payments.module");
const typeorm_1 = require("@nestjs/typeorm");
const tickets_module_1 = require("./tickets/tickets.module");
const config_1 = require("@nestjs/config");
const orm_config_1 = require("./config/orm.config");
const bookings_module_1 = require("./bookings/bookings.module");
const music_module_1 = require("./music/music.module");
const images_module_1 = require("./images/images.module");
const merchandise_module_1 = require("./merchandise/merchandise.module");
const media_module_1 = require("./media/media.module");
const auth_module_1 = require("./auth/auth.module");
const concerts_module_1 = require("./concerts/concerts.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: orm_config_1.typeOrmConfig,
            }),
            payments_module_1.PaymentsModule,
            tickets_module_1.TicketsModule,
            bookings_module_1.BookingsModule,
            music_module_1.MusicModule,
            images_module_1.ImagesModule,
            merchandise_module_1.MerchandiseModule,
            media_module_1.MediaModule,
            auth_module_1.AuthModule,
            concerts_module_1.ConcertsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map