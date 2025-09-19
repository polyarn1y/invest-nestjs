import {Expose, Exclude } from "class-transformer";

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string

  @Expose()
  email: string
  
  @Expose({ name: 'createdAt' })
  created_at: Date
  
  @Expose({ name: 'updatedAt' })
  updated_at: Date
}