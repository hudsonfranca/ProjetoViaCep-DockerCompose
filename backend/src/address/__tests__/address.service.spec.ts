import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken} from '@nestjs/typeorm';
import { AddressService } from '../address.service';
import { ViaCepService } from '../viacep.service';
import {Address } from '../address.entity';
import { AddressRepository } from '../repository/address-repository';


const address ={
  cep: "08090-284",
  logradouro: "Rua 03 de Outubro",
  complemento: "(Ch Três Meninas)",
  bairro: "Jardim Helena",
  localidade: "São Paulo",
  uf: "SP",
  ibge: "3550308",
  gia: "1004",
  ddd: "11",
  siafi: "7107",
}

const CreatedAddress = Address.of({
  id:"1e5f6826-dd82-4c41-98c4-55908251e5ec",
  createdAt:new Date(),
  updatedAt:new Date(),
  ...address
})


describe('AddressService', () => {
  let service: AddressService;
  let viaCepService:ViaCepService;
  let addressRepository: AddressRepository;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,{
          provide:ViaCepService,
          useValue:{
            getAddressByCep:jest.fn().mockResolvedValue(address)
          }
        },{
          provide:getRepositoryToken(AddressRepository),
          useValue:{
            findAddressByCep:jest.fn().mockResolvedValue(CreatedAddress),
            createAddress:jest.fn().mockResolvedValue(CreatedAddress)
          }
        }],
    }).compile();

    service = module.get<AddressService>(AddressService);
    viaCepService = module.get<ViaCepService>(ViaCepService);
    addressRepository = module.get(getRepositoryToken(AddressRepository));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(viaCepService).toBeDefined();
    expect(addressRepository).toBeDefined();
  });

  it('should call findAddressByCep from addressRepository ',async()=>{
    const cep = "08090-284"
    const addressRepositorySpy = jest.spyOn(addressRepository,'findAddressByCep')
    const resut = await service.findAddressByCep(cep);    
    expect(resut).toEqual(address);
    expect(addressRepositorySpy).toHaveBeenCalledWith(cep);
  })

  it('should call findAddressByCep from ViaCepService ',async()=>{
    const cep = "08090-284"
    const viaCepServiceSpy = jest.spyOn(viaCepService,'getAddressByCep')
    jest.spyOn(addressRepository,'findAddressByCep').mockResolvedValue(null)
    const resut = await service.findAddressByCep(cep);    
    expect(resut).toEqual(address);
    expect(viaCepServiceSpy).toHaveBeenCalledWith(cep);
  })
});
