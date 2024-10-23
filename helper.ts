import { ConfigService } from '@nestjs/config';
import { dataSource } from './src/database/database.module';
import bcrypt from 'bcrypt';
import {
  CreateDateColumn,
  EntitySchema,
  ObjectType,
  UpdateDateColumn,
} from 'typeorm';
// import { createDecipheriv } from 'crypto'
const configService = new ConfigService();

export abstract class CreatedModified {
  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  modified!: Date;
}

export const defaultDomain = 'printoKart.app';

export function getSingleBy<T = any>(
  table: ObjectType<T> | EntitySchema<T>,
): (filter: Partial<T>, columns?: any[], sortings?) => Promise<T> {
  return async (filter, columns?, sortings?) => {
    const condition: any = {
      where: filter,
    };
    if (columns?.length > 0) {
      condition.select = columns;
    }
    if (sortings) {
      condition.order = sortings;
    }
    const dataSourceFinal = await dataSource;
    const repository = dataSourceFinal.getRepository(table);
    return (await repository.findOne(condition)) || undefined;
  };
}

export function getManyBy<T = any>(
  table: ObjectType<T> | EntitySchema<T>,
): (filter: Partial<T>, columns?: any[], sortings?) => Promise<T[]> {
  return async (filter, columns?, sortings?) => {
    const condition: any = { where: filter };
    if (columns?.length > 0) {
      condition.select = columns;
    }
    if (sortings) {
      condition.order = sortings;
    }
    const dataSourceFinal = await dataSource;
    const repository = dataSourceFinal.getRepository(table);
    return await repository.find(condition);
  };
}

export enum Constants {
  DefaultUserId = 1,
  OTPWaitingPeriod = 30,
  OTPExpiry = 15,
}

// export const dateType = ['Marriage', 'Open Relationship', 'Casual Dating']

// export function decryptString(encmessage: string) {
//   const algorithm = configService.get('ALGORITHM')
//   const initVector = configService.get('INIT_VECTOR').toString().slice(0, 16)
//   const encryptDecryptKey = configService.get('ENC_DEC_KEY')
//   const bufferKey = Buffer.from(encryptDecryptKey, 'hex')
//   const decipher = createDecipheriv(algorithm, bufferKey, initVector)
//   let decryptedData = decipher.update(encmessage, 'hex', 'utf-8')
//   decryptedData += decipher.final('utf8')

//   return decryptedData
// }

export class ColumnDecimalTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}
