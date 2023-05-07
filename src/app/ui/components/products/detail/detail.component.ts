import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Detail_Product } from 'src/app/contracts/detail_product';
import { List_Product } from 'src/app/contracts/list_product';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { ProductService } from 'src/app/services/common/models/product.service';
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap');

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent extends BaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService, 
    private productService: ProductService, 
    private alertifyService : AlertifyService,
    private route: ActivatedRoute
    ){
    super(spinner)
  }

  id : string
  productDetail: Detail_Product[]

  async ngOnInit() {
     this.route.params.subscribe(params => {
      this.id = params["id"];
    })
    this.productDetail = await this.getProductDetail(this.id)
    console.log("productDetail => " , this.productDetail)
    console.log("productDetail => " , this.productDetail)


  }

  private async getProductDetail(id: string)  {
    this.showSpinner(SpinnerType.BallAtom);
    const productDetail:  Detail_Product[] = await this.productService.readById(id, () => this.hideSpinner(SpinnerType.BallAtom), (errorMessage) => this.alertifyService.message(errorMessage,{
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      }));
      console.log(productDetail[0].product.name)
      debugger
      return productDetail
  }


}
