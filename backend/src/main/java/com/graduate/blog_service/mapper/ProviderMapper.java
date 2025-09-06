package com.graduate.blog_service.mapper;

import com.graduate.blog_service.Dto.providerDto.ProviderDto;
import com.graduate.blog_service.Dto.providerDto.UpdateProviderDto;
import com.graduate.blog_service.models.Provider;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProviderMapper {
    Provider toEntity(ProviderDto providerDto);

    ProviderDto toDto(Provider provider);
    UpdateProviderDto toUpdateDto(Provider provider);

}