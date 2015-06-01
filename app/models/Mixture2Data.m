%clear all;
%close all;

load('allcomponents_lib_updated.mat');
load('GC_data_updated.mat');
load('Ideal_Distillations_V4.mat');

P_tot=101.3;

components={butene,hexene,methyl_pentanoate,ethyl_levulinate};
%components={eval(ins{1}), eval(ins{2}), eval(ins{3}), eval(ins{4})}
x0=[.1199;.4713;.3353;.0735]; %mixture 1 model fuel
x0_low=[.1173;.4726;.3364;.0737];
x0_high=[.1124;.470;.3343;.0733];
x01=[.113;.475;.338;.074]; %target value

x0=x0_low;
x0=x0/sum(x0);
mixture_params=Cmp_Props(components);
C_atoms=mixture_params{5};
H_atoms=mixture_params{6};
O_atoms=mixture_params{7};
MW=C_atoms.*12.01+H_atoms.*1.008+O_atoms.*16; %molecular weight of individual components

H_C_ratio=sum(H_atoms.*x0)/sum(C_atoms.*x0)
O_C_ratio=sum(O_atoms.*x0)/sum(C_atoms.*x0)

T1=distillation(x0,mixture_params,GCVOL_GC,Unifac_GC,P_tot);
%T2=distillation(x01,mixture_params,GCVOL_GC,Unifac_GC,P_tot);

press_sat=mixture_params{3};
P_vap=Pvap(311,press_sat)
gamma=UNIFAC(311,x0,mixture_params,Unifac_GC);
P_guess=sum(P_vap.*x0)

mfi=x0.*MW/sum(x0.*MW)

rvp=RVP(x0,mixture_params,GCVOL_GC,Unifac_GC)
TVL=TVL20(x0,mixture_params,GCVOL_GC,Unifac_GC)

recovered = [0;5;10;15;20;25;30;35;40;45;50;55;60;65;70;75;80;85;90;95;99];

%plot(recovered,T1)