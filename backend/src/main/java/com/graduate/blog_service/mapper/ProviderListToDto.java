package com.graduate.blog_service.mapper;

import com.graduate.blog_service.Dto.providerDto.ProviderListDto;
import com.graduate.blog_service.models.Provider;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProviderListToDto {

    ProviderListDto toDto(Provider provider);

}