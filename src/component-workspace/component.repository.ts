import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { Component } from '../entities/workspace/component.entity';

@Injectable()
export class ComponentWorkspaceRepository extends Repository<Component> {
  constructor(entityManager: EntityManager) {
    super(Component, entityManager);
  }
}
