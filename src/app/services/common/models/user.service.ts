import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from 'src/app/entities/user';
import { CreateUser } from 'src/app/contracts/users/create_user';
import { Observable, firstValueFrom } from 'rxjs';
import { CustomToastrService } from '../../ui/custom-toastr.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService, private toastrService: CustomToastrService) { }

  async create(user: User): Promise<CreateUser>{
    const observable: Observable<CreateUser | User> = this.httpClientService.post<CreateUser | User>({
      controller: "users"
    }, user)
    return await firstValueFrom(observable) as CreateUser;
  }
}
