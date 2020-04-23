import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserSchema } from './user.schema'
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';

@Module({
    imports: [
        MongooseModule.forFeatureAsync(
            [
                {
                    name: 'User', 
                    useFactory: () => {
                        const schema = UserSchema;
                        schema.post('save', (doc) => {
                            doc.overwrite({updatedAt: Date.now().toLocaleString("en-US")});
                        })
                        return schema;
                    }
                }
            ]
        )
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {};