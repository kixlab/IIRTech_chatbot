# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-06 13:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatbot', '0006_auto_20171206_1254'),
    ]

    operations = [
        migrations.CreateModel(
            name='Entity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity', models.TextField(default='')),
            ],
        ),
    ]