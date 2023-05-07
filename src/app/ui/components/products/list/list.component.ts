import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { BaseUrl } from 'src/app/contracts/base_url';
import { Create_Basket_Item } from 'src/app/contracts/basket/create_basket_item';
import { Detail_Product } from 'src/app/contracts/detail_product';
import { List_Product } from 'src/app/contracts/list_product';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { BasketService } from 'src/app/services/common/models/basket.service';
import { FileService } from 'src/app/services/common/models/file.service';
import { ProductService } from 'src/app/services/common/models/product.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit{

  constructor(
    private productService: ProductService, 
    private activatedRoute: ActivatedRoute, 
    private fileService: FileService,
    private alertifyService : AlertifyService,
    spinner: NgxSpinnerService,
    private basketService: BasketService,
    private toastrService: CustomToastrService

    ) {
      super(spinner)
     }

     currentPageNo: number;
     totalProductCount: number;
     totalPageCount: number;
     pageSize: number = 12;
     pageList: number[] = [];
     baseUrl: BaseUrl;
   
     products: List_Product[];
  async ngOnInit() {

    this.baseUrl = await this.fileService.getBaseStorageUrl();

    this.activatedRoute.params.subscribe(async params => {
      this.currentPageNo = parseInt(params["pageNo"] ?? 1);

      const data: { totalProductCount: number; products: List_Product[] } = await this.productService.read(this.currentPageNo - 1, this.pageSize,
        () => {

        },
        errorMessage => {

        });

        this.products = data.products;
   
        this.products = this.products.map<List_Product>(p => {
          const listProduct: List_Product = {
            id: p.id,
            createdDate: p.createdDate,
            imagePath: p.productImageFiles.length &&  p.productImageFiles.find(p => p.showcase) != undefined ? p.productImageFiles.find(p => p.showcase).path : "",
            name: p.name,
            price: p.price,
            stock: p.stock,
            updatedDate: p.updatedDate,
            productImageFiles: p.productImageFiles
          };
  
          return listProduct;
        });

        this.totalProductCount = data.totalProductCount;
        this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);
  
        this.pageList = [];
  
        if (this.currentPageNo - 3 <= 0)
          for (let i = 1; i <= 7; i++)
            this.pageList.push(i);
  
        else if (this.currentPageNo + 3 >= this.totalPageCount)
          for (let i = this.totalPageCount - 6; i <= this.totalPageCount; i++)
            this.pageList.push(i);
  
        else
          for (let i = this.currentPageNo - 3; i <= this.currentPageNo + 3; i++)
            this.pageList.push(i);
      });
  }

  async getProductDetail(id : string){
    this.showSpinner(SpinnerType.BallAtom);
    const allProducts:  Detail_Product[] = await this.productService.readById(id, () => this.hideSpinner(SpinnerType.BallAtom), (errorMessage) => this.alertifyService.message(errorMessage,{
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      }));
      console.log(allProducts)
      console.log(id)
  }

  async addToBasket(product: List_Product){
    this.showSpinner(SpinnerType.BallAtom)
    let _basketItem: Create_Basket_Item = new Create_Basket_Item();
    _basketItem.productId = product.id;
    _basketItem.quantity = 1;
    await this.basketService.add(_basketItem);
    this.hideSpinner(SpinnerType.BallAtom);
    this.toastrService.message("The product has been added to the cart", "Added to Cart",{
      messageType: ToastrMessageType.Success,
      position: ToastrPosition.TopRight,
      
    })
  }
}

