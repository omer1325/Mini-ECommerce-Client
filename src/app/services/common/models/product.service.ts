import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Create_Product } from 'src/app/contracts/create_product';
import { List_Product } from 'src/app/contracts/list_product';
import { HttpClientService } from '../http-client.service';
import { List_Product_Image } from 'src/app/contracts/list_product_images';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClientService: HttpClientService) { }
//(errorMessage: string) => {}  ----------- any
  create(product: Create_Product, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void ) {
    this.httpClientService.post({
      controller: "products"
    }, product)
      .subscribe({
        next: () => successCallBack(),
        error: (errorResponse: HttpErrorResponse) => {
          const _error: Array<{ key: string, value: Array<string> }> = errorResponse.error;
          let message = "";
  
          _error.forEach((v, index) => {
            v.value.forEach((_v, _index) => {
              message += `${_v}<br>`;
            });
          });
          errorCallBack(message);
        }});
        // complete: () => console.info('complete') 
  }
  
  async read(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void ): 
    Promise<{ totalCount: number; products: List_Product[] }> {
      const promiseData: Observable<{ totalCount: number; products: List_Product[] }> = this.httpClientService.get<{ totalCount: number; products: List_Product[] }>({
        controller: "products",
        queryString: `page=${page}&size=${size}`
      })
      // .toPromise();
      const data = await firstValueFrom(promiseData);
      try {
        await data;
        successCallBack()
      } catch (errorResponse: any) {
        errorCallBack(errorResponse.message)
      }
      // firstNumber.then(d => successCallBack())
      //   .catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message));

      return await data;
  }

  async delete(id: string){
    const deleteObservable: Observable<any> = this.httpClientService.delete<any>({
      controller: "products"
    }, id);

    await firstValueFrom(deleteObservable);
  }

  async readImages(id: string, successCallBack?: () => void): Promise<List_Product_Image[]> {
    const getObservable: Observable<List_Product_Image[]> = this.httpClientService.get<List_Product_Image[]>({
      action: "getproductimages",
      controller: "products"
    }, id);

    const images: List_Product_Image[] = await firstValueFrom(getObservable);
    successCallBack();
    return images;
  }

  async deleteImage(id: string, imageId: string, successCallBack?: () => void) {
    const deleteObservable = this.httpClientService.delete({
      action: "deleteproductimage",
      controller: "products",
      queryString: `imageId=${imageId}`
    }, id)
    await firstValueFrom(deleteObservable);
    successCallBack();
  }
} 
