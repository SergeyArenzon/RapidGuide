import { Injectable } from '@nestjs/common';
import { GetProfilesResponseDto } from '@rapid-guide-io/contracts';

@Injectable()
export class RoleService {

    getRoles(
        profiles: GetProfilesResponseDto,
      ): string[] {
        const roles: string[] = [];
      
        if (profiles.guide) {
          roles.push('guide');
        }
      
        return roles;
      }
      
      
}
